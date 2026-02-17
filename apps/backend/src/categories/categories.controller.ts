import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { CategoriesService } from "./categories.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  CategoriesListResponseDto,
  CategoryDeleteResponseDto,
} from "./dto";
import { Public } from "../common/decorators";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: "Get all categories",
    description:
      "Retrieve a list of all active categories. Use includeInactive=true to include inactive categories.",
  })
  @ApiQuery({
    name: "includeInactive",
    required: false,
    type: Boolean,
    description: "Include inactive categories in the response",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Categories retrieved successfully",
    type: CategoriesListResponseDto,
  })
  async findAll(
    @Query("includeInactive") includeInactive?: string
  ): Promise<CategoriesListResponseDto> {
    const includeInactiveFlag = includeInactive === "true";
    const categories = await this.categoriesService.findAll(includeInactiveFlag);
    return {
      categories,
      total: categories.length,
    };
  }

  @Get(":id")
  @Public()
  @ApiOperation({
    summary: "Get category by ID",
    description: "Retrieve a single category by its ID",
  })
  @ApiParam({
    name: "id",
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category retrieved successfully",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  async findById(@Param("id") id: string): Promise<CategoryResponseDto> {
    return this.categoriesService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new category",
    description: "Create a new quiz category (requires authentication, future: admin only)",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Category created successfully",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Category with the same name already exists",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a category",
    description: "Update an existing category by ID (requires authentication, future: admin only)",
  })
  @ApiParam({
    name: "id",
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category updated successfully",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Category with the same name already exists",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a category",
    description:
      "Soft delete a category by setting it as inactive (requires authentication, future: admin only)",
  })
  @ApiParam({
    name: "id",
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category deleted successfully",
    type: CategoryDeleteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Authentication required",
  })
  async delete(@Param("id") id: string): Promise<CategoryDeleteResponseDto> {
    await this.categoriesService.delete(id);
    return { message: "Category deleted successfully" };
  }
}
