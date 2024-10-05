import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/home.dart';
import 'package:hms_frontend/pages/students/media.dart';
import 'package:hms_frontend/pages/students/studentsAssignment.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:hms_frontend/pages/submissions.dart';

class ScreenNavigator extends StatefulWidget {
  const ScreenNavigator({super.key});

  @override
  State<ScreenNavigator> createState() => _ScreenNavigatorState();
}

class _ScreenNavigatorState extends State<ScreenNavigator> {
  int selectedIndex = 0;

  //Used for navigation bar to determine which screen needs to appear
  List<Widget> pages = const [
    HomePage(),
    StudentsAssignmentsPage(),
    SubmissionsPage(),
    MediaPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: pages[selectedIndex],
        bottomNavigationBar: GNav(
          backgroundColor: Colors.black,
          color: Colors.white,
          activeColor: Colors.lightBlueAccent[200],
          gap: 5,
          tabs: const [
            GButton(
              icon: Icons.home,
            ),
            GButton(icon: Icons.assignment),
            GButton(icon: Icons.task),
            GButton(icon: Icons.photo_camera_back_rounded),
          ],
          onTabChange: (index){
            setState(() {
              selectedIndex = index;
            });
          },
        ),
      ),
    );
  }
}