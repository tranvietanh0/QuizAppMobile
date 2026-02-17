import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from "./dto";

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all categories
   * @param includeInactive - If true, includes inactive categories (default: false)
   */
  async findAll(includeInactive = false): Promise<CategoryResponseDto[]> {
    const whereClause = includeInactive ? {} : { isActive: true };

    const categories = await this.prisma.category.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    this.logger.log(`Found ${categories.length} categories`);
    return categories;
  }

  /**
   * Get a single category by ID
   * @param id - Category ID
   */
  async findById(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  /**
   * Find a category by name
   * @param name - Category name
   */
  async findByName(name: string): Promise<CategoryResponseDto | null> {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    return category;
  }

  /**
   * Create a new category
   * @param createCategoryDto - Category creation data
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const { name, description, iconUrl, color, isActive } = createCategoryDto;

    // Check if category with same name already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException(`Category with name "${name}" already exists`);
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        description,
        iconUrl,
        color: color || "#3B82F6",
        isActive: isActive ?? true,
      },
    });

    this.logger.log(`Created new category: ${category.name} (${category.id})`);
    return category;
  }

  /**
   * Update an existing category
   * @param id - Category ID
   * @param updateCategoryDto - Category update data
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    // If name is being updated, check for conflicts
    if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
      const categoryWithSameName = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name },
      });

      if (categoryWithSameName) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`
        );
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
        iconUrl: updateCategoryDto.iconUrl,
        color: updateCategoryDto.color,
        isActive: updateCategoryDto.isActive,
      },
    });

    this.logger.log(`Updated category: ${updatedCategory.name} (${updatedCategory.id})`);
    return updatedCategory;
  }

  /**
   * Soft delete a category (set isActive = false)
   * @param id - Category ID
   */
  async delete(id: string): Promise<void> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    // Soft delete by setting isActive to false
    await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Soft deleted category: ${existingCategory.name} (${id})`);
  }

  /**
   * Update the question count for a category
   * This should be called when questions are added/removed from a category
   * @param id - Category ID
   */
  async updateQuestionCount(id: string): Promise<CategoryResponseDto> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    // Count active questions in this category
    const questionCount = await this.prisma.question.count({
      where: {
        categoryId: id,
        isActive: true,
      },
    });

    // Update the category with the new count
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: { questionCount },
    });

    this.logger.log(
      `Updated question count for category ${updatedCategory.name}: ${questionCount}`
    );
    return updatedCategory;
  }
}
