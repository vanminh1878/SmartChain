using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class DeleteStoreIdInCategories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_Store",
                table: "Category");

            migrationBuilder.DropIndex(
                name: "IX_Category_Store_id",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "Store_id",
                table: "Category");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Store_id",
                table: "Category",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Category_Store_id",
                table: "Category",
                column: "Store_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_Store",
                table: "Category",
                column: "Store_id",
                principalTable: "Store",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
