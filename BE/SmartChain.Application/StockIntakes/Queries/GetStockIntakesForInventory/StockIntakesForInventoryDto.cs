namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;

public class StockIntakesForInventoryDto
{
    public Guid StockIntakeId { get; set; }
    public string supplier { get; set; }
    public DateTime IntakeDate { get; set; }
    public string Created_By_Name { get; set; }
    public int Status { get; set; }
    public string Approved_By_Name { get; set; }

}