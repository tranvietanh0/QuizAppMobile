// Cấu hình commitlint - kiểm tra format của commit messages
// Format: type(scope): message
// Ví dụ: feat(auth): add Google login support

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type phải là một trong các giá trị sau
    "type-enum": [
      2,
      "always",
      [
        "feat", // Tính năng mới
        "fix", // Sửa lỗi
        "docs", // Thay đổi documentation
        "style", // Format code (không ảnh hưởng logic)
        "refactor", // Refactor code
        "perf", // Cải thiện performance
        "test", // Thêm tests
        "build", // Thay đổi build system
        "ci", // Thay đổi CI config
        "chore", // Các thay đổi khác
        "revert", // Revert commit trước
      ],
    ],
    // Type không được để trống
    "type-empty": [2, "never"],
    // Subject không được để trống
    "subject-empty": [2, "never"],
    // Subject không quá 100 ký tự
    "subject-max-length": [2, "always", 100],
    // Body mỗi dòng không quá 200 ký tự
    "body-max-line-length": [2, "always", 200],
  },
};
