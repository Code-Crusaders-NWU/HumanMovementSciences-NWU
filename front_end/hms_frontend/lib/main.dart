import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/login.dart';
import 'package:hms_frontend/pages/admin.dart';
import 'package:hms_frontend/pages/lecturrersAssign.dart';

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
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.lightBlue),
        useMaterial3: true,
      ),
      home: const AssignmentsPage(),
    );
  }
}
