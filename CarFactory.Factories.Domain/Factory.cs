namespace CarFactory.Factories.Domain;

public class Factory : BaseEntity
{
    public int MyProperty { get; set; }
    public List<Business> Businesses { get; set; } = [];
}
