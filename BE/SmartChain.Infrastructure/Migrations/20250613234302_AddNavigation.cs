using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class AddNavigation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CartId",
                table: "Cart_Detail",
                newName: "Cart_id");

            migrationBuilder.RenameIndex(
                name: "IX_Cart_Detail_CartId",
                table: "Cart_Detail",
                newName: "IX_Cart_Detail_Cart_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Cart_id",
                table: "Cart_Detail",
                newName: "CartId");

            migrationBuilder.RenameIndex(
                name: "IX_Cart_Detail_Cart_id",
                table: "Cart_Detail",
                newName: "IX_Cart_Detail_CartId");
        }
    }
}
