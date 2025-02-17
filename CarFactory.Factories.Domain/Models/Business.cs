using CarFactory.Factories.Domain.ValueObjects;

namespace CarFactory.Factories.Domain.Models;

public class Business : BaseEntity
{
    public required string Name { get; set; }
    public required string Customer { get; set; }
    public List<Factory> Factories { get; set; } = [];
    public List<Employee> Employees { get; set; } = [];
}
