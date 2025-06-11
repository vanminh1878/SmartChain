using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class DeleteOwnerId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Store_User",
                table: "Store");

            migrationBuilder.DropIndex(
                name: "IX_Store_Owner_id",
                table: "Store");

            migrationBuilder.DropColumn(
                name: "Owner_id",
                table: "Store");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Product",
                type: "nvarchar(500)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Owner_id",
                table: "Store",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Product",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)");

            migrationBuilder.CreateIndex(
                name: "IX_Store_Owner_id",
                table: "Store",
                column: "Owner_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Store_User",
                table: "Store",
                column: "Owner_id",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
