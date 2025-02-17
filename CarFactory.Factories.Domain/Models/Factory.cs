namespace CarFactory.Factories.Domain.Models;

public class Factory : BaseEntity
{
    public int MyProperty { get; set; }
    public required Address Address { get; set; }
    public List<Business> Businesses { get; set; } = [];
}
