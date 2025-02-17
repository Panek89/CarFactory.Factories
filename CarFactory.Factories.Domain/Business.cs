namespace CarFactory.Factories.Domain;

public class Business : BaseEntity
{
    public required string Name { get; set; }
    public List<Factory> Factories { get; set; } = [];
}
