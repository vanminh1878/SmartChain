using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class DeleteStoreIdInSupplier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_Store",
                table: "Supplier");

            migrationBuilder.DropIndex(
                name: "IX_Supplier_Store_id",
                table: "Supplier");

            migrationBuilder.DropColumn(
                name: "Store_id",
                table: "Supplier");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Store_id",
                table: "Supplier",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_Store_id",
                table: "Supplier",
                column: "Store_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Store",
                table: "Supplier",
                column: "Store_id",
                principalTable: "Store",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
