using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class AllowCustomerIdNullInCart : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cart_CustomerId_Unique",
                table: "Cart");

            migrationBuilder.AlterColumn<Guid>(
                name: "Customer_id",
                table: "Cart",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_Customer_id",
                table: "Cart",
                column: "Customer_id",
                unique: true,
                filter: "[Customer_id] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_CustomerId_StoreId_Unique",
                table: "Cart",
                columns: new[] { "Customer_id", "Store_id" },
                unique: true,
                filter: "[Customer_id] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cart_Customer_id",
                table: "Cart");

            migrationBuilder.DropIndex(
                name: "IX_Cart_CustomerId_StoreId_Unique",
                table: "Cart");

            migrationBuilder.AlterColumn<Guid>(
                name: "Customer_id",
                table: "Cart",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cart_CustomerId_Unique",
                table: "Cart",
                column: "Customer_id",
                unique: true);
        }
    }
}
