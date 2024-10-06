import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/home.dart';
import 'package:hms_frontend/pages/lecturers/lecturrersAssignPage.dart';
import 'package:hms_frontend/pages/students/media.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:hms_frontend/pages/submissions.dart';

class LecturerScreenNavigator extends StatefulWidget {
  const LecturerScreenNavigator({super.key});

  @override
  State<LecturerScreenNavigator> createState() => _LecturerScreenNavigatorState();
}

class _LecturerScreenNavigatorState extends State<LecturerScreenNavigator> {
  int selectedIndex = 0;

  //Used for navigation bar to determine which screen needs to appear
  List<Widget> pages = const [
    HomePage(),
    AssignmentsPage(),
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
          activeColor: Colors.purpleAccent[200],
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
