import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/home.dart';
import 'package:hms_frontend/pages/lecturers/createAssignmentPage.dart';
import 'package:hms_frontend/pages/lecturers/lecturrersAssignPage.dart';
import 'package:hms_frontend/pages/login.dart';
import 'package:hms_frontend/pages/submissions.dart';
import 'package:hms_frontend/services/auth.services.dart';
import 'package:hms_frontend/services/token.services.dart';

class LecNavbar extends StatelessWidget {
  const LecNavbar({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.create),
            title: const Text('View Assignments'),
            onTap: () async{
              String email = await AuthServices.getEmail();
              Navigator.push(context, MaterialPageRoute(builder: (context) => AssignmentsPage(email: email,))); 
            },
          ),
          ListTile(
            leading: const Icon(Icons.manage_accounts),
            title: const Text('Create Assignments'),
            onTap: () async{ 
              String email = await AuthServices.getEmail();
              Navigator.push(context, MaterialPageRoute(builder: (context) =>  AssignmentCreatePage(email: email,)));   
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