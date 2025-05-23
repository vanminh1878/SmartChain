using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class AddUniqueConstraintToCartCustomerId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cart_Customer_id",
                table: "Cart");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_CustomerId_Unique",
                table: "Cart",
                column: "Customer_id",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cart_CustomerId_Unique",
                table: "Cart");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_Customer_id",
                table: "Cart",
                column: "Customer_id");
        }
    }
}
