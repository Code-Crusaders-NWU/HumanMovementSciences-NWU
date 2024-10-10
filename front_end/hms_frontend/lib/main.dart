import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/admins/admin.dart';
import 'package:hms_frontend/pages/landing.dart';
import 'package:hms_frontend/pages/lecturers/createLecturersPage.dart';
import 'package:hms_frontend/pages/login.dart';
import 'package:hms_frontend/pages/students/studentSubmissionPage.dart';
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.purple),
        useMaterial3: true,
      ),
      home: const StudentSubmissionPage(studentEmail: "stephan",),
    );
  }
}
