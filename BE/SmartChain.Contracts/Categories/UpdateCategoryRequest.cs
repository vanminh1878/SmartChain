namespace SmartChain.Contracts.Categories;

public record UpdateCategoryRequest(
    string Name,
    bool Status);