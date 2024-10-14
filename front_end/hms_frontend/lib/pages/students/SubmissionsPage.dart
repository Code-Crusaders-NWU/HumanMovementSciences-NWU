import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/services/order.services.dart';
import 'package:hms_frontend/services/submissions.services.dart';
import 'package:intl/intl.dart';

class StudentViewSubmissionsPage extends StatefulWidget {
  const StudentViewSubmissionsPage({super.key, required this.stuEmail});

  final String stuEmail;

  @override
  State<StudentViewSubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<StudentViewSubmissionsPage> {
  bool showVideoPlayer = false;
  bool isLoading = true;
  List<Map<String, dynamic>> submissions = [];
  bool isLatestOrder = true;

  @override
  void initState() {
    super.initState();
    _getSubmissions(); //populate assignments list
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(
        titleText: "My Submissons",
        backgroundColor: Colors.lightBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [      
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _toggleOrder,
                    icon: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 600),
                      transitionBuilder:
                          (Widget child, Animation<double> animation) {
                        return RotationTransition(
                          turns: child.key == const ValueKey('latest')
                              ? Tween<double>(begin: 0, end: 1).animate(animation)
                              : Tween<double>(begin: 0.5, end: 1)
                                  .animate(animation),
                          child: FadeTransition(opacity: animation, child: child),
                        );
                      },
                      child: Icon(
                        color: Colors.white,
                        isLatestOrder
                            ? Icons.arrow_downward_outlined
                            : Icons.arrow_upward_outlined,
                        key: ValueKey(isLatestOrder ? 'latest' : 'earliest'),
                      ),
                    ),
                    label: Text(
                      isLatestOrder ? "Order By: Latest" : "Order By: Earliest",
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w700),
                    ),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple),
                  ),
                ),
              ],
            ),
            Expanded(
              child: Center(
                child: isLoading
                    ? const CircularProgressIndicator()
                    : submissions.isEmpty
                        ? const Text(
                            'No submissions available.',
                            style:
                                TextStyle(fontSize: 16, color: Colors.black54),
                          )
                        : ListView.builder(
                            itemCount: submissions.length,
                            itemBuilder: (context, index) {
                              final sub = submissions[index];
                              String? mark = sub['grade']?.toString() ?? 'N/A';
                              String date = DateFormat('yMMMd').add_jm().format(
                                  DateTime.parse(sub['submission_Date']));

                              return Card(
                                elevation: 10,
                                color: Colors.teal[50],
                                margin:
                                    const EdgeInsets.symmetric(vertical: 8.0),
                                child: ListTile(
                                  title: Text(
                                    sub['assignm_Num'].toString(),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w900,
                                      fontSize: 14,
                                      color: Colors.black,
                                    ),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
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

  void _getSubmissions() async {
    try {
      final List<Map<String, dynamic>> fetchedSubmissions =
          await SubmissionServices().fetchStudentSubmissions(widget.stuEmail);

      setState(() {
        submissions = fetchedSubmissions;
        isLoading = false;
        _sortSubmissions();
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      throw "$e";
    }
  }

  void _toggleOrder() {
    setState(() {
      isLatestOrder =
          !isLatestOrder; //if false, become true. If true, become false
      _sortSubmissions();
    });
  }

  void _sortSubmissions() {
    if (isLatestOrder) {
      submissions = OrderServices.sortSubmissionsLatest(
          submissions); //Order by descending
    } else {
      submissions = OrderServices.sortSubmissionsEarliest(
          submissions); //Order by ascending
    }
  }
}
