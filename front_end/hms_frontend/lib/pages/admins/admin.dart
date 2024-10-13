import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/main.dart';
import 'package:hms_frontend/pages/lecturers/createLecturersPage.dart';
import 'package:hms_frontend/components/adminNavbar.dart';

class AdminPage extends StatefulWidget {
  const AdminPage({super.key});

  @override
  State<AdminPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: AdminNavbar(),
      appBar: MyAppBar(titleText: "Admin's Page",),
      body: const SafeArea(
        child: Text('Admin Page'),
        ),
      );
  }
}
