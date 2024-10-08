import 'package:flutter/material.dart';
import 'package:hms_frontend/services/assignments.services.dart'; // Ensure this is correctly imported
import 'package:intl/intl.dart';
import 'package:hms_frontend/services/submissions.services.dart'; // Import the video submission page

class SubmissionsPage extends StatefulWidget {
  const SubmissionsPage({super.key});

  @override
  State<SubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<SubmissionsPage> {
  List<Map<String, dynamic>> assignments = []; // to store fetched assignments

  @override
  void initState() {
    super.initState();
    fetchAssignments(); // Populate assignments list
  }

  void fetchAssignments() async {
    try {
      final List<Map<String, dynamic>> fetchedAssignments =
          await AssignmentService().fetchAssignments(); // Adjust this to fetch the appropriate assignments
      setState(() {
        assignments = fetchedAssignments;
      });
    } catch (e) {
      print('Error fetching assignments: $e');
      // Handle error appropriately
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Submissions',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: ListView.builder(
            itemCount: assignments.length,
            itemBuilder: (context, index) {
              final assignment = assignments[index];
              String date = DateFormat('yMMMd')
                  .add_jm()
                  .format(DateTime.parse(assignment['due_date']));

              return Card(
                color: Colors.blue[100], // Light blue card background
                margin: const EdgeInsets.symmetric(vertical: 8.0),
                child: ListTile(
                  title: Text(
                    assignment['title'] ?? 'No Title',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                  subtitle: Text(
                    'Due: $date',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.black54,
                    ),
                  ),
                  trailing: IconButton(
                    icon: const Icon(
                      Icons.arrow_forward,
                      color: Colors.blue,
                    ),
                    onPressed: () {
                      // Navigate to the videos submission page
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => SubmissionsPage()//assignmentId: assignment['id']), // Adjust based on your data structure
                        ),
                      );
                    },
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
