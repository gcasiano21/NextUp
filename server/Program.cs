using Google.Cloud.Firestore;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Put your frontend URL here
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<FirestoreDb>(provider =>
{

    string projectId = builder.Configuration["ProjectId"] ?? Environment.GetEnvironmentVariable("GOOGLE_PROJECT_ID");


    if (string.IsNullOrEmpty(projectId))

    {

 

        throw new InvalidOperationException("Firebase Project ID is not configured. " +

                                            "Please set 'ProjectId' in appsettings.json or as a GOOGLE_PROJECT_ID environment variable.");

    }


    return FirestoreDb.Create(projectId);

});


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
