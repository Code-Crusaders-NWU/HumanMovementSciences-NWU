import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';

class StudentsAssignmentsPage extends StatefulWidget {
  const StudentsAssignmentsPage({super.key});

  @override
  State<StudentsAssignmentsPage> createState() => _StudentAssignmentsPageState();
}

class _StudentAssignmentsPageState extends State<StudentsAssignmentsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Assignments',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.lightBlue,
      ),
      body: const Padding(
        
        padding: EdgeInsets.all(16.0),
        child: Center(child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          
          children: <Widget>[
            //Code hier binne asb
            Card(color: Colors.blue,
            )
          ],
        ),),
      
    ),
    );
  }
}