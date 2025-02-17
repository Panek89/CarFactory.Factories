namespace CarFactory.Factories.Domain.Models;

public class Address : BaseEntity
{
    public required string Street { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }
}
