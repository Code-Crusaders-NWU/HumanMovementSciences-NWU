import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/components/textBox.dart';
import 'package:hms_frontend/services/assignments.services.dart';
import 'package:intl/intl.dart';

class StudentsAssignmentsPage extends StatefulWidget {
  const StudentsAssignmentsPage({super.key});

  @override
  State<StudentsAssignmentsPage> createState() =>
      _StudentAssignmentsPageState();
}

class _StudentAssignmentsPageState extends State<StudentsAssignmentsPage> {
  List<Map<String, dynamic>> assignments = []; //to store fetched assignments

  @override
  void initState() {
    super.initState();
    fetchAssignments(); //populate assignments list
  }

  void fetchAssignments() async {
    try {
      final List<Map<String, dynamic>> fetchedAssignments =
          await AssignmentService().fetchAssignments();
      setState(() {
        assignments = fetchedAssignments;
      });
    } catch (e) {
      throw "$e";
    }
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
                  trailing: IconButton(
                    icon: const Icon(
                      Icons.upload_file,
                      color: Colors.blue,
                    ),
                    onPressed: () {},
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
