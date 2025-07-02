using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// -------------------------------------------
// Listen on specific port (5002) on all interfaces
// -------------------------------------------
if (builder.Environment.IsDevelopment())
{
    // Local debugging - bind to localhost only
    builder.WebHost.UseUrls("https://localhost:7055/");
}
else
{
    // Production/public - bind to all interfaces
    builder.WebHost.UseUrls("http://0.0.0.0:5002");
}

// -------------------------------------------
// Add services to the container
// -------------------------------------------
builder.Services.AddControllersWithViews();

var app = builder.Build();

// -------------------------------------------
// Configure the HTTP request pipeline
// -------------------------------------------
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// -------------------------------------------
// Configure routing
// -------------------------------------------
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllers();

app.Run();
