import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/components/myButton.dart';
import 'package:hms_frontend/pages/students/studentSubmissionPage.dart';
import 'package:intl/intl.dart';
import 'package:hms_frontend/services/submissions.services.dart';

class SubmissionsPage extends StatefulWidget {
  const SubmissionsPage({super.key, required this.assignNumb});

  final int assignNumb;

  @override
  State<SubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<SubmissionsPage> {
  List<Map<String, dynamic>> submissions = []; // to store submissions from an assignment
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSubmissions();
  }

  void fetchSubmissions() async {
    try {
      final List<Map<String, dynamic>> fetchedAssignments =
          await SubmissionServices().fetchAssignmentSubmissions(widget.assignNumb);
      setState(() {
        submissions = fetchedAssignments;
        isLoading = false;
      });
    } catch (e) {
      print('Error fetching assignments: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(titleText: "Submissions"),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            MyButton(
              text: "Refresh Page",
              onPressed: () {
                setState(() {
                  isLoading = true; 
                });
                fetchSubmissions();
              },
              buttonColor: Colors.lightBlue,
              icon: const Icon(Icons.refresh),
            ),
            Expanded(
              child: Center(
                child: isLoading
                    ? const CircularProgressIndicator()
                    : submissions.isEmpty
                        ? const Text(
                            'No submissions available.',
                            style: TextStyle(fontSize: 16, color: Colors.black54),
                          )
                        : ListView.builder(
                            itemCount: submissions.length,
                            itemBuilder: (context, index) {
                              final sub = submissions[index];
                              String? mark = sub['grade']?.toString() ?? 'N/A';
                              String date = DateFormat('yMMMd')
                                  .add_jm()
                                  .format(DateTime.parse(sub['submission_Date']));

                              return Card(
                                elevation: 10,
                                color: Colors.teal[50], 
                                margin: const EdgeInsets.symmetric(vertical: 8.0),
                                child: ListTile(
                                  title: Text(
                                    sub['stu_Email'],
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w900,
                                      fontSize: 14,
                                      color: Colors.black,
                                    ),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const SizedBox(height: 8),
                                      Text(
                                        'Feedback: ${sub['feedback']?.toString() ?? 'No feedback'}',
                                        style: const TextStyle(
                                          color: Colors.black54,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        'Mark: $mark',
                                        textAlign: TextAlign.left,
                                        style: const TextStyle(
                                          fontSize: 12,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        date,
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: Colors.black54,
                                        ),
                                      ),
                                    ],
                                  ),
                                  trailing: IconButton(
                                    icon: const Icon(
                                      Icons.add_task_rounded,
                                      color: Colors.deepPurple,
                                    ),
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => StudentSubmissionsPage(
                                            stuEmail: sub['stu_Email'],
                                            assignmNumb: sub['assignm_Num'],
                                            uri: sub['content'],
                                            mark: sub['grade'] ?? 0,
                                            feedback: sub['feedback'] ?? '',
                                          ),
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
          ],
        ),
      ),
    );
  }
}
