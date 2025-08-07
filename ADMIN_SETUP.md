# Admin Functionality Setup Guide

## Overview
This chat application now includes comprehensive admin functionality with role-based authentication and user management capabilities.

## Features Added

### 1. Role-Based Authentication
- **User Role**: Regular chat users
- **Admin Role**: Administrators with full user management capabilities
- Login toggle to switch between user and admin login

### 2. Admin Dashboard Features
- **Create Users**: Add new users manually with full details
- **Read Users**: View all users with search functionality
- **Update Users**: Edit user information (name, email, mobile, role)
- **Delete Users**: Soft delete (mark as inactive) or hard delete
- **Search Users**: Filter users by name or email

### 3. Security Features
- Admin-only routes protected by middleware
- Role validation on login
- Admin users cannot be deleted
- Soft delete functionality to preserve data

### 4. User Experience Improvements
- **Admin users are hidden from normal user contact lists** - Regular users cannot see or chat with admin users
- **Admin users are automatically redirected to admin dashboard** - No chat interface shown to admins
- **Role-based navigation** - Different navbar options for admin vs regular users
- **Profile access control** - Admin users don't see profile link, regular users don't see admin link

## Setup Instructions

### 1. Create Admin User
Run the following command to create the default admin user:

```bash
cd backend
npm run create-admin
```

This will create an admin user with:
- **Email**: admin@chatapp.com
- **Password**: admin123
- **Mobile**: 1234567890
- **Role**: admin

### 2. Start the Application

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Admin Dashboard

1. Go to the login page
2. Toggle to "Admin" mode
3. Login with admin credentials:
   - Email: admin@chatapp.com
   - Password: admin123
4. You'll be automatically redirected to the admin dashboard

### 4. User Experience

#### For Regular Users:
- Can only see and chat with other regular users
- Admin users are completely hidden from contact lists
- Access to chat interface and profile management
- Cannot access admin dashboard

#### For Admin Users:
- Automatically redirected to admin dashboard on login
- No chat interface shown
- Full user management capabilities
- Cannot be seen or contacted by regular users

## API Endpoints

### Admin Routes (Protected)
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users` - Get all users (with search)
- `GET /api/admin/users/:userId` - Get specific user
- `PUT /api/admin/users/:userId` - Update user
- `DELETE /api/admin/users/:userId` - Soft delete user
- `DELETE /api/admin/users/:userId/hard` - Hard delete user

### Query Parameters
- `search`: Search users by name or email
- `includeInactive`: Set to 'true' to include inactive users

## Database Schema Updates

### User Model
```javascript
{
  email: String (required, unique),
  mobile: String (required, unique),
  fullName: String (required),
  password: String (required),
  profilePic: String (default: ""),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  timestamps: true
}
```

## Security Considerations

1. **Role Validation**: All admin routes check for admin role
2. **Soft Delete**: Users are marked as inactive rather than permanently deleted
3. **Admin Protection**: Admin users cannot be deleted
4. **Input Validation**: All user inputs are validated
5. **Error Handling**: Comprehensive error handling for all operations
6. **Admin Isolation**: Admin users are hidden from regular user contact lists
7. **Role-Based UI**: Different interfaces for different user roles

## Usage Examples

### Creating a New User
```javascript
// Admin can create users through the dashboard
// Or via API:
POST /api/admin/users
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "password123",
  "role": "user"
}
```

### Searching Users
```javascript
// Search by name or email
GET /api/admin/users?search=john

// Include inactive users
GET /api/admin/users?includeInactive=true
```

### Updating a User
```javascript
PUT /api/admin/users/:userId
{
  "fullName": "John Smith",
  "email": "johnsmith@example.com",
  "mobile": "1234567890",
  "role": "user"
}
```

## User Flow Examples

### Regular User Login:
1. Login as regular user
2. Redirected to chat interface
3. Can only see other regular users in contact list
4. Can chat with regular users only
5. Access to profile management

### Admin User Login:
1. Login as admin user
2. Automatically redirected to admin dashboard
3. No chat interface shown
4. Full user management capabilities
5. Cannot be contacted by regular users

## Troubleshooting

### Common Issues

1. **Admin user not found**: Run `npm run create-admin` in backend directory
2. **Permission denied**: Ensure you're logged in as admin
3. **User not found**: Check if user exists and is active
4. **Validation errors**: Ensure all required fields are provided
5. **Admin users visible in contact list**: Check that the backend filter is working correctly

### Logs
Check the backend console for detailed error messages and API logs.

## Future Enhancements

- User activity tracking
- Bulk user operations
- Advanced filtering options
- User statistics and analytics
- Email notifications for user changes
- Admin user activity logs
- Role-based message permissions
