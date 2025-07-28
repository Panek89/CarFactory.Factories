#!/bin/sh

KEYCLOAK_URL=http://${KEYCLOAK_HOST}:${KEYCLOAK_PORT}
ADMIN_USER=${KEYCLOAK_ADMIN}
ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD}
REALM_NAME=${KEYCLOAK_REALM}
CLIENT_ID=${KEYCLOAK_CLIENT_ID}
CLIENT_SECRET=${KEYCLOAK_CLIENT_SECRET}
USER_NAME=${KEYCLOAK_USER}
USER_PASSWORD=${KEYCLOAK_USER_PASSWORD}
USER_EMAIL=${KEYCLOAK_USER_EMAIL}

echo "Starting Keycloak initialization..."

# Uncomment if you want for debug see variables
echo "Environment variables:"
echo "  KEYCLOAK_URL: $KEYCLOAK_URL"
echo "  KEYCLOAK_ADMIN: $KEYCLOAK_ADMIN"
echo "  REALM_NAME: $REALM_NAME"
echo "  CLIENT_ID: $CLIENT_ID"
echo "  CLIENT_SECRET: $CLIENT_SECRET"
echo "  USER_NAME: $USER_NAME"
echo ""

wait_for_keycloak() {
    echo "Waiting for Keycloak availability..."
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$KEYCLOAK_URL/health/ready" > /dev/null 2>&1; then
            echo "Keycloak is available!"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts - Keycloak not ready yet..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "Timeout: Keycloak is not available after $max_attempts attempts"
    exit 1
}

get_admin_token() {
    echo "Getting admin token..."
    
    ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=$ADMIN_USER" \
        -d "password=$ADMIN_PASSWORD" \
        -d "grant_type=password" \
        -d "client_id=admin-cli" | \
        sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
    
    if [ -z "$ADMIN_TOKEN" ]; then
        echo "Failed to get admin token"
        exit 1
    fi
    
    echo "Admin token obtained"
}

realm_exists() {
    curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        "$KEYCLOAK_URL/admin/realms/$REALM_NAME" | grep -q "200"
}

create_realm() {
    if realm_exists; then
        echo "Realm '$REALM_NAME' already exists, skipping creation"
        return 0
    fi
    
    echo "Creating realm '$REALM_NAME'..."
    
    response=$(curl -s -w "%{http_code}" -o /tmp/realm_response \
        -X POST "$KEYCLOAK_URL/admin/realms" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"realm\": \"$REALM_NAME\",
            \"enabled\": true,
            \"displayName\": \"My Custom Realm\",
            \"registrationAllowed\": true,
            \"loginWithEmailAllowed\": true,
            \"duplicateEmailsAllowed\": false,
            \"resetPasswordAllowed\": true,
            \"editUsernameAllowed\": true,
            \"bruteForceProtected\": true
        }")
    
    if [ "$response" = "201" ]; then
        echo "Realm '$REALM_NAME' created successfully"
    else
        echo "Error creating realm. HTTP code: $response"
        cat /tmp/realm_response
        exit 1
    fi
}

client_exists() {
    curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
        "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients?clientId=$CLIENT_ID" | \
        grep -q "\"clientId\":\"$CLIENT_ID\""
}

create_client() {
    if client_exists; then
        echo "Client '$CLIENT_ID' already exists, skipping creation"
        return 0
    fi
    
    echo "Creating client '$CLIENT_ID'..."
    
    response=$(curl -s -w "%{http_code}" -o /tmp/client_response \
        -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"clientId\": \"$CLIENT_ID\",
            \"enabled\": true,
            \"clientAuthenticatorType\": \"client-secret\",
            \"secret\": \"$CLIENT_SECRET\",
            \"redirectUris\": [\"*\"],
            \"webOrigins\": [\"*\"],
            \"publicClient\": false,
            \"directAccessGrantsEnabled\": true,
            \"serviceAccountsEnabled\": true,
            \"standardFlowEnabled\": true,
            \"implicitFlowEnabled\": false,
            \"attributes\": {
                \"access.token.lifespan\": \"3600\"
            }
        }")
    
    if [ "$response" = "201" ]; then
        echo "Client '$CLIENT_ID' created successfully"
    else
        echo "Error creating client. HTTP code: $response"
        cat /tmp/client_response
        exit 1
    fi
}

user_exists() {
    curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
        "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$USER_NAME" | \
        grep -q "\"username\":\"$USER_NAME\""
}

create_user() {
    if user_exists; then
        echo "User '$USER_NAME' already exists, skipping creation"
        return 0
    fi
    
    echo "Creating user '$USER_NAME'..."
    
    response=$(curl -s -w "%{http_code}" -o /tmp/user_response \
        -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"$USER_NAME\",
            \"email\": \"$USER_EMAIL\",
            \"enabled\": true,
            \"emailVerified\": true,
            \"firstName\": \"Test\",
            \"lastName\": \"User\",
            \"credentials\": [{
                \"type\": \"password\",
                \"value\": \"$USER_PASSWORD\",
                \"temporary\": false
            }]
        }")
    
    if [ "$response" = "201" ]; then
        echo "User '$USER_NAME' created successfully"
    else
        echo "Error creating user. HTTP code: $response"
        cat /tmp/user_response
        exit 1
    fi
}

test_direct_access() {
    echo "Testing Direct Access Grants..."
    
    token_response=$(curl -s -X POST "$KEYCLOAK_URL/realms/$REALM_NAME/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=$USER_NAME" \
        -d "password=$USER_PASSWORD" \
        -d "grant_type=password" \
        -d "client_id=$CLIENT_ID" \
        -d "client_secret=$CLIENT_SECRET")
    
    if echo "$token_response" | grep -q "access_token"; then
        echo "Direct Access Grants working correctly!"
        echo "Access token received for user '$USER_NAME'"
    else
        echo "Error testing Direct Access Grants:"
        echo "$token_response"
        exit 1
    fi
}

main() {
    wait_for_keycloak
    get_admin_token
    create_realm
    create_client
    create_user
    test_direct_access
    
    echo ""
    echo "Keycloak initialization completed successfully!"
    echo ""
    echo "Summary:"
    echo "   Realm: $REALM_NAME"
    echo "   Client ID: $CLIENT_ID"
    echo "   Client Secret: $CLIENT_SECRET"
    echo "   Username: $USER_NAME"
    echo "   Password: $USER_PASSWORD"
    echo ""
    echo "You can now log in to Keycloak Admin Console:"
    echo "   URL: $KEYCLOAK_URL"
    echo "   Admin: $ADMIN_USER / $ADMIN_PASSWORD"
}

main
