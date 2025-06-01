
# Changelog

All notable changes to Didiz Closet POS System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Branch management system for multi-location support
- Staff management with role-based access control
- Business information management
- Owner role with ability to switch between branches
- Branch-specific data filtering for products, transactions, and expenses
- Staff can only view data from their assigned branch
- Owner can view data from all branches and switch between them
- Enhanced authentication system with branch assignments
- Branch context for managing branch-related operations

### Changed
- Updated Product model to include branchId for branch association
- Updated Transaction model to include branchId for branch tracking  
- Updated Expense model to include branchId for branch-specific expenses
- Enhanced user roles to support branch-based permissions
- Modified inventory context to filter data by branch
- Updated reports to show branch-specific data based on user permissions

### Technical
- Created BranchContext for managing branch operations
- Added Branch, Staff, and BusinessInfo interfaces
- Enhanced type definitions for branch management
- Added role-based access control throughout the application
- Implemented branch switching functionality for owners
- Added localStorage persistence for branch data

## [1.0.0] - 2024-12-XX

### Added
- Initial release of Didiz Closet POS System
- Product inventory management
- Transaction processing (sales, purchases, adjustments)
- Basic reporting and analytics
- User authentication system
- Mobile-responsive design
- Barcode generation and scanning
- Low stock alerts
- Expense tracking
- Discount management system

### Features
- Dashboard with key metrics
- Inventory management with categories
- Sales transaction processing
- Purchase order management
- Financial reporting
- User profile management
- Settings and preferences
- Theme support (light/dark mode)
