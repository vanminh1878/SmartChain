using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class DBInventorynew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_Store",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_StockIntake_Store",
                table: "Stock_Intake");

            migrationBuilder.DropForeignKey(
                name: "FK_StockIntake_Supplier",
                table: "Stock_Intake");

            migrationBuilder.DropForeignKey(
                name: "FK_StockIntakeDetail_StockIntake",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropIndex(
                name: "IX_Stock_Intake_Store_id",
                table: "Stock_Intake");

            migrationBuilder.DropIndex(
                name: "IX_Stock_Intake_Supplier_id",
                table: "Stock_Intake");

            migrationBuilder.DropIndex(
                name: "IX_Product_Store_id",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "IntakeDate",
                table: "Stock_Intake");

            migrationBuilder.DropColumn(
                name: "Store_id",
                table: "Stock_Intake");

            migrationBuilder.DropColumn(
                name: "Supplier_id",
                table: "Stock_Intake");

            migrationBuilder.DropColumn(
                name: "Unit_price",
                table: "Product_Supplier");

            migrationBuilder.DropColumn(
                name: "Store_id",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Profit_margin",
                table: "Category");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "Stock_Intake_Detail",
                newName: "Unit_price");

            migrationBuilder.AddColumn<DateTime>(
                name: "IntakeDate",
                table: "Stock_Intake_Detail",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "Profit_margin",
                table: "Stock_Intake_Detail",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0.30m);

            migrationBuilder.AddColumn<Guid>(
                name: "Store_id",
                table: "Stock_Intake_Detail",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "Supplier_id",
                table: "Stock_Intake_Detail",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Detail_Store_id",
                table: "Stock_Intake_Detail",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Detail_Supplier_id",
                table: "Stock_Intake_Detail",
                column: "Supplier_id");

            migrationBuilder.AddForeignKey(
                name: "FK_StockIntakeDetail_StockIntake",
                table: "Stock_Intake_Detail",
                column: "StockIntakeId",
                principalTable: "Stock_Intake",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockIntakeDetail_Store",
                table: "Stock_Intake_Detail",
                column: "Store_id",
                principalTable: "Store",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockIntakeDetail_Supplier",
                table: "Stock_Intake_Detail",
                column: "Supplier_id",
                principalTable: "Supplier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockIntakeDetail_StockIntake",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropForeignKey(
                name: "FK_StockIntakeDetail_Store",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropForeignKey(
                name: "FK_StockIntakeDetail_Supplier",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropIndex(
                name: "IX_Stock_Intake_Detail_Store_id",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropIndex(
                name: "IX_Stock_Intake_Detail_Supplier_id",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropColumn(
                name: "IntakeDate",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropColumn(
                name: "Profit_margin",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropColumn(
                name: "Store_id",
                table: "Stock_Intake_Detail");

            migrationBuilder.DropColumn(
                name: "Supplier_id",
                table: "Stock_Intake_Detail");

            migrationBuilder.RenameColumn(
                name: "Unit_price",
                table: "Stock_Intake_Detail",
                newName: "UnitPrice");

            migrationBuilder.AddColumn<DateTime>(
                name: "IntakeDate",
                table: "Stock_Intake",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "Store_id",
                table: "Stock_Intake",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "Supplier_id",
                table: "Stock_Intake",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "Unit_price",
                table: "Product_Supplier",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "Store_id",
                table: "Product",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "Profit_margin",
                table: "Category",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0.30m);

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Store_id",
                table: "Stock_Intake",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Supplier_id",
                table: "Stock_Intake",
                column: "Supplier_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Store_id",
                table: "Product",
                column: "Store_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Store",
                table: "Product",
                column: "Store_id",
                principalTable: "Store",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockIntake_Store",
                table: "Stock_Intake",
                column: "Store_id",
                principalTable: "Store",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockIntake_Supplier",
                table: "Stock_Intake",
                column: "Supplier_id",
                principalTable: "Supplier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockIntakeDetail_StockIntake",
                table: "Stock_Intake_Detail",
                column: "StockIntakeId",
                principalTable: "Stock_Intake",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
