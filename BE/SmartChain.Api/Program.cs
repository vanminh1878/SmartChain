using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SmartChain.Application.Categories.Commands.CreateCategory;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Infrastructure;
using SmartChain.Infrastructure.Common.Persistence;
using SmartChain.Infrastructure.Persistence.Repositories;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Đăng ký AppDbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateCategoryCommand).Assembly));

// Đăng ký các repository
builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
builder.Services.AddScoped<IRolesRepository, RolesRepository>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ISuppliersRepository, SuppliersRepository>();
builder.Services.AddScoped<IStoresRepository, StoresRepository>();
builder.Services.AddScoped<IStockIntakesRepository, StockIntakesRepository>();
builder.Services.AddScoped<IStockIntakeDetailsRepository, StockIntakeDetailsRepository>();
builder.Services.AddScoped<ISchedulesRepository, SchedulesRepository>();
builder.Services.AddScoped<IReportsRepository, ReportsRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderDetailsRepository, OrderDetailsRepository>();
builder.Services.AddScoped<IEmployeesRepository, EmployeesRepository>();
builder.Services.AddScoped<IProductsRepository, ProductsRepository>();
builder.Services.AddScoped<ICartsRepository, CartsRepository>();
builder.Services.AddScoped<ICartDetailsRepository, CartDetailsRepository>();
builder.Services.AddScoped<IAccountsRepository, AccountsRepository>();
builder.Services.AddScoped<ICustomersRepository, CustomersRepository>();

// Đăng ký IHttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Thêm controllers
builder.Services.AddControllers();
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.SetMinimumLevel(LogLevel.Debug);
});

var app = builder.Build();

// // Thêm middleware xử lý lỗi
// app.UseExceptionHandler(errorApp =>
// {
//     errorApp.Run(async context =>
//     {
//         context.Response.StatusCode = 500;
//         context.Response.ContentType = "application/json; charset=utf-8";
//         context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
//         await context.Response.WriteAsync(JsonSerializer.Serialize(new
//         {
//             message = "Lỗi server nội bộ",
//             status = 500
//         }));
//     });
// });

// Thêm middleware localization
app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("vi-VN"),
    SupportedCultures = new[] { new CultureInfo("vi-VN") },
    SupportedUICultures = new[] { new CultureInfo("vi-VN") }
});

// Cấu hình middleware
app.UseCors("AllowReactApp");
app.MapControllers();

app.Run();