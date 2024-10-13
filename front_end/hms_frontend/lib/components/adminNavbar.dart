import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/admins/users.dart';
import 'package:hms_frontend/pages/lecturers/createLecturersPage.dart';
import 'package:hms_frontend/pages/lecturers/lecturrersAssignPage.dart';
import 'package:hms_frontend/pages/login.dart';
import 'package:hms_frontend/pages/submissions.dart';
import 'package:hms_frontend/services/token.services.dart';

class AdminNavbar extends StatelessWidget {
  const AdminNavbar({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.create),
            title: const Text('Add a lecturer'),
            onTap: (){
              Navigator.push(context, MaterialPageRoute(builder: (context) => const CreateLecturersPage())); 
            },
          ),
          ListTile(
            leading: const Icon(Icons.manage_accounts),
            title: const Text('Manage Users'),
            onTap: (){ 
              Navigator.push(context, MaterialPageRoute(builder: (context) => const UsersPage()));   
            },
          ),
          ListTile(
            leading: const Icon(Icons.assignment_add),
            title: const Text('Manage Assignments'),
            onTap: (){
              Navigator.push(context, MaterialPageRoute(builder: (context) => const AssignmentsPage()));    
            },
          ),
          ListTile(
            leading: const Icon(Icons.assignment_add),
            title: const Text('Logout'),
            onTap: (){
             TokenService().deleteToken();
             Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => LoginScreen()));    
            },
          ),
        ],
      ),
    );
  }
}