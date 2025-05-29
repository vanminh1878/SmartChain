using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartChain.Infrastructure.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Username = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Name = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Fullname = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Birthday = table.Column<DateTime>(type: "datetime", nullable: false),
                    Address = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Sex = table.Column<bool>(type: "bit", nullable: false),
                    Avatar = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    Account_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Role_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Account",
                        column: x => x.Account_id,
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_Role",
                        column: x => x.Role_id,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Store",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Owner_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Store", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Store_User",
                        column: x => x.Owner_id,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Category_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Fullname = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Address = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Customer_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    User_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employee_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employee_User",
                        column: x => x.User_id,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Generated_by = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FilePath = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Report_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Report_User",
                        column: x => x.Generated_by,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Supplier",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Contact_name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    Address = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Supplier_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    Category_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_Category",
                        column: x => x.Category_id,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Product_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Cart",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Customer_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cart", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cart_Customer",
                        column: x => x.Customer_id,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Cart_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Customer_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Order_Customer",
                        column: x => x.Customer_id,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Order_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Schedule",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Employee_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schedule_Employee",
                        column: x => x.Employee_id,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stock_Intake",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Supplier_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Store_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IntakeDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Created_by = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Approved_by = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stock_Intake", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockIntake_ApprovedBy_User",
                        column: x => x.Approved_by,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockIntake_CreatedBy_User",
                        column: x => x.Created_by,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockIntake_Store",
                        column: x => x.Store_id,
                        principalTable: "Store",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockIntake_Supplier",
                        column: x => x.Supplier_id,
                        principalTable: "Supplier",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Cart_Detail",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Product_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    CartId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cart_Detail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartDetail_Cart",
                        column: x => x.CartId,
                        principalTable: "Cart",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartDetail_Product",
                        column: x => x.Product_id,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Order_Detail",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Product_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order_Detail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDetail_Order",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetail_Product",
                        column: x => x.Product_id,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stock_Intake_Detail",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "newid()"),
                    Product_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    StockIntakeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stock_Intake_Detail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockIntakeDetail_Product",
                        column: x => x.Product_id,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockIntakeDetail_StockIntake",
                        column: x => x.StockIntakeId,
                        principalTable: "Stock_Intake",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_Username",
                table: "Account",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cart_CustomerId_Unique",
                table: "Cart",
                column: "Customer_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cart_Store_id",
                table: "Cart",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_Detail_CartId",
                table: "Cart_Detail",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_Detail_Product_id",
                table: "Cart_Detail",
                column: "Product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Category_Store_id",
                table: "Category",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Email",
                table: "Customer",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Store_id",
                table: "Customer",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Store_id",
                table: "Employee",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_User_id",
                table: "Employee",
                column: "User_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Customer_id",
                table: "Order",
                column: "Customer_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Store_id",
                table: "Order",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Detail_OrderId",
                table: "Order_Detail",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Detail_Product_id",
                table: "Order_Detail",
                column: "Product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Category_id",
                table: "Product",
                column: "Category_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Store_id",
                table: "Product",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Generated_by",
                table: "Report",
                column: "Generated_by");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Store_id",
                table: "Report",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_Employee_id",
                table: "Schedule",
                column: "Employee_id");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Approved_by",
                table: "Stock_Intake",
                column: "Approved_by");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Created_by",
                table: "Stock_Intake",
                column: "Created_by");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Store_id",
                table: "Stock_Intake",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Supplier_id",
                table: "Stock_Intake",
                column: "Supplier_id");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Detail_Product_id",
                table: "Stock_Intake_Detail",
                column: "Product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Intake_Detail_StockIntakeId",
                table: "Stock_Intake_Detail",
                column: "StockIntakeId");

            migrationBuilder.CreateIndex(
                name: "IX_Store_Email",
                table: "Store",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Store_Owner_id",
                table: "Store",
                column: "Owner_id");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_Store_id",
                table: "Supplier",
                column: "Store_id");

            migrationBuilder.CreateIndex(
                name: "IX_User_Account_id",
                table: "User",
                column: "Account_id");

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                table: "User",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_id",
                table: "User",
                column: "Role_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cart_Detail");

            migrationBuilder.DropTable(
                name: "Order_Detail");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropTable(
                name: "Schedule");

            migrationBuilder.DropTable(
                name: "Stock_Intake_Detail");

            migrationBuilder.DropTable(
                name: "Cart");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Stock_Intake");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Supplier");

            migrationBuilder.DropTable(
                name: "Store");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
