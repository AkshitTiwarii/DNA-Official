# DNA Forge Hub - Admin System Setup

This guide will help you set up the admin system for content management without coding.

## 🚀 Features

- **Content Management**: Create, edit, and delete announcements, notes, resources, projects, and events
- **Role-Based Access**: Three permission levels (Admin, Moderator, Editor)
- **Rich Content Editor**: Easy-to-use interface for content creation
- **Dynamic Display**: Content automatically appears on the website
- **User Management**: Add/remove admin users with different permissions

## 📋 Prerequisites

1. Supabase account and project
2. Environment variables set up in your `.env` file:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## 🛠 Database Setup

1. **Run the SQL Schema**
   - Open your Supabase project dashboard
   - Go to the SQL Editor
   - Copy and paste the contents of `database-setup.sql`
   - Execute the SQL to create tables and policies

2. **Add Your First Admin User**
   - Sign up for an account on your website
   - Copy your user ID from Supabase Auth dashboard
   - In Supabase SQL Editor, run:
   ```sql
   INSERT INTO admin_users (id, email, role, is_active) 
   VALUES ('your-user-id-here', 'your-email@example.com', 'admin', true);
   ```

## 👥 User Roles & Permissions

### Admin
- ✅ Manage users (add/remove admins)
- ✅ Create, edit, delete all content
- ✅ Access all admin features

### Moderator
- ❌ Cannot manage users
- ✅ Create, edit, delete all content
- ✅ Access content management

### Editor
- ❌ Cannot manage users
- ❌ Cannot delete content
- ✅ Create and edit content

## 📝 Content Types

1. **Announcements** - Important updates and news
2. **Notes** - General information and updates
3. **Resources** - Helpful guides and materials
4. **Projects** - Showcase completed projects
5. **Events** - Upcoming events and activities

## 🎯 How to Use

### Accessing Admin Panel
1. Log in to your account
2. Click on your profile avatar in the top navigation
3. Select "Admin Panel" (only visible to admin users)

### Creating Content
1. Go to Admin Dashboard
2. Click "Create Content" button
3. Fill in title, content, and settings
4. Choose content type and status
5. Add tags if needed
6. Toggle "Featured" to highlight content
7. Click "Create Content"

### Managing Content
1. Go to Admin Dashboard → Content tab
2. Use filters to find specific content
3. Click edit button to modify content
4. Click delete button to remove content
5. Use status dropdown to publish/unpublish

### Managing Users (Admin only)
1. Go to Admin Dashboard → Users tab
2. Click "Add Admin" to invite new users
3. Enter email and select role
4. Existing users can have roles changed
5. Remove users by clicking the trash icon

## 🌐 Where Content Appears

- **Featured Content**: Homepage hero section
- **Announcements**: Homepage announcements section
- **Resources**: Homepage resources section
- **All Published Content**: Respective category pages

## 🔧 Customization

### Adding New Content Types
1. Update the `type` enum in `database-setup.sql`
2. Add the new type to TypeScript interfaces in `src/types/admin.ts`
3. Update content forms and displays accordingly

### Modifying Permissions
Edit the RLS policies in `database-setup.sql` to change permission logic.

## 🐛 Troubleshooting

### "Access Denied" Error
- Ensure you're added as an admin user in the database
- Check that your user account is active
- Verify RLS policies are properly set

### Content Not Appearing
- Check content status is set to "published"
- Verify the content type matches the display component
- Check browser console for any errors

### Database Connection Issues
- Verify Supabase URL and keys in environment variables
- Check Supabase project is active and accessible
- Ensure database tables were created successfully

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify database tables and policies are set up correctly
3. Ensure your user has proper admin permissions
4. Contact your development team for technical support

---

**Note**: This admin system is designed to be user-friendly for non-technical team members. No coding knowledge is required to manage content once the initial setup is complete.
