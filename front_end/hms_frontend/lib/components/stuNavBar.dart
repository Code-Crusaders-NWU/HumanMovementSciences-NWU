import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/lecturers/createAssignmentPage.dart';
import 'package:hms_frontend/pages/login.dart';
import 'package:hms_frontend/pages/students/studentsAssignment.dart';
import 'package:hms_frontend/services/token.services.dart';

class StuNavBar extends StatelessWidget {
  const StuNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.create),
            title: const Text('View Assignments'),
            onTap: (){
              Navigator.push(context, MaterialPageRoute(builder: (context) => StudentsAssignmentsPage())); 
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout_rounded),
            title: const Text('View Submissions'),
            onTap: (){
              Navigator.pushReplacement(
                            context, 
                            MaterialPageRoute(builder: (context) => LoginScreen()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.logout_rounded),
            title: const Text('Logout'),
            onTap: (){
              TokenService().deleteToken();
              Navigator.pushReplacement(
                            context, 
                            MaterialPageRoute(builder: (context) => LoginScreen()));
            },
          ),
        ],
      ),
    );
  }
}