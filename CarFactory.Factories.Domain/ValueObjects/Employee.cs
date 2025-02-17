using System.ComponentModel.DataAnnotations.Schema;

namespace CarFactory.Factories.Domain.ValueObjects;

public class Employee
{
    public required string EvidenceNo { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";
    [NotMapped]
    public string FullNameReverse => $"{LastName} {FirstName}";
}
