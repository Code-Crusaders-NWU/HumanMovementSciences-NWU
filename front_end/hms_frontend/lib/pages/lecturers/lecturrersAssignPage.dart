import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:intl/intl.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/pages/lecturers/createAssignmentPage.dart';
import 'package:hms_frontend/services/assignments.services.dart';
import 'package:hms_frontend/services/auth.services.dart';
import 'package:hms_frontend/services/token.services.dart';

class AssignmentsPage extends StatefulWidget {
  const AssignmentsPage({super.key});

  @override
  State<AssignmentsPage> createState() => _AssignmentsPageState();
}

class _AssignmentsPageState extends State<AssignmentsPage> {
  List<Map<String, dynamic>> assignments = [];

  Future<void> setLecturerAssignments() async {
    String? token = await TokenService().getToken();
    
    String email = await AuthServices.getEmail(token!);

    final List<Map<String, dynamic>> fetchedAssignments =
      await AssignmentService().fetchLecturerAssignments(email);

    setState(() {
      assignments = fetchedAssignments;
  });
    }

  @override
  void initState() {
    super.initState();
    setLecturerAssignments();
  }

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
        backgroundColor: Colors.deepPurple,
      ),
      body: Container(
        child: Center(
          child: ListView.builder(
            itemCount: assignments.length,
            itemBuilder: (context, index) {
              final a = assignments[index];
              String date = DateFormat('yMMMd')
                  .add_jm()
                  .format(DateTime.parse(a['due_date']));
              return Container(
                margin:
                    const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                decoration: BoxDecoration(
                  color: index % 2 == 0
                      ? Colors.lightBlue[50]
                      : Colors.lightGreen[50],
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 2,
                      blurRadius: 5,
                      offset: Offset(0, 3), // Changes position of shadow
                    ),
                  ],
                ),
                child: ListTile(
                  title: Text(
                    a['title'] ?? 'No Title',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        a['description']?.toLowerCase() ?? 'No Description',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                      const SizedBox(
                          height:
                              4), // Add some spacing between description and date
                      Text(
                        a['due_date'] != null
                            ? DateFormat('yMMMd')
                                .add_jm()
                                .format(DateTime.parse(a['due_date']))
                            : 'No Due Date', // Ensure date is formatted properly
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                  trailing: SizedBox(
                    width: 120,
                    child: Row(
                     mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                          icon:  Icon(
                            Icons.delete_forever,
                            color: Colors.red[300],
                          ),
                          onPressed: () async {

                            showCupertinoDialog(context: context, 
                            builder: (BuildContext context)=>CupertinoAlertDialog(
                              title: const Text('Alert'),
                              content: const Text('Are you sure you want to delete this assignment?'),
                              actions: <CupertinoDialogAction>[
                                CupertinoDialogAction(
                                child: const Text('No'),
                                isDestructiveAction: false,
                                onPressed: (){
                                  Navigator.pop(context);
                                },
                                
                              ),
                              CupertinoDialogAction(
                                isDestructiveAction: true,
                                onPressed: () async {
                                   bool deleteState = await AssignmentService().deleteAssignment(a['assignm_Num']); 
                                    if (deleteState){
                                      setState(() {
                                        assignments.removeAt(index);
                                      });
                                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Assignment deleted..')));
                            }
                                  Navigator.pop(context);
                                },
                                child: const Text('Yes'), 
                              ),
                              ]
                            ),);
                          },
                        ),
                        
                        IconButton(
                          icon:   Icon(
                            Icons.download,
                            color: Colors.blue[200],
                          ),
                          onPressed: () async {
                            bool downloadStatus = await AssignmentService().downloadMarks(a['assignm_Num'], a['title']);

                            if (!downloadStatus){
                              print('No submissions');
                            }
                          },
                        ),

                        IconButton(
                          icon:  const Icon(
                            Icons.remove_red_eye,
                            color: Colors.black54,
                          ),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const AssignmentCreatePage()));
        },
        child: const Icon(
          Icons.add,
          color: Colors.deepPurple,
        ),
      ),
    );
  }
}