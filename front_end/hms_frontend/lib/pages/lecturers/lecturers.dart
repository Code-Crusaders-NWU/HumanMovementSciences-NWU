import 'package:flutter/material.dart';
import 'package:hms_frontend/components/lecNavbar.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/pages/lecturers/createLecturersPage.dart';
import 'package:hms_frontend/components/adminNavbar.dart';

class LecturerPage extends StatefulWidget {
  const LecturerPage({super.key});

  @override
  State<LecturerPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<LecturerPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: LecNavbar(),
      appBar: AppBar(
        title: const Text(
          'NWU HMS Lecturer Page',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),  
        backgroundColor: Colors.deepPurple,
      ),
      body: const SafeArea(
        child: Text('Lecturer Page'),
        ),
      );
  }
}
