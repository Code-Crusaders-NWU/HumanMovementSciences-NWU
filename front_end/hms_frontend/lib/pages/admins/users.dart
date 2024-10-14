import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/components/myAppbar.dart';
import 'package:hms_frontend/pages/lecturers/lecturrersAssignPage.dart';
import 'package:hms_frontend/pages/students/SubmissionsPage.dart';
import 'package:hms_frontend/services/users.services.dart';

class UsersPage extends StatefulWidget {
  const UsersPage({super.key});

  @override
  State<UsersPage> createState() => _UsersPageState();
}

class _UsersPageState extends State<UsersPage> {
  List<Map<String, dynamic>> users = []; // List of json objects (MAP)

  @override
  void initState() {
    super.initState();
    getUsers(); // populate user list
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(titleText: "Manage Users"),
      body: Container(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: ListView.builder(
            itemCount: users.length,
            itemBuilder: (context, index) {
              // Loop to populate the page with cards of users
              final u = users[index];
              return Container(
                margin:
                    const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                decoration: BoxDecoration(
                  color: u['user_type']=="lecturer" || u['user_type']=="admin"
                      ? Colors.blueGrey[700]
                      : Colors.teal[300],
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.5),
                      spreadRadius: 2,
                      blurRadius: 5,
                      offset: const Offset(0, 3),
                    )
                  ],
                ),
                child: ListTile(
                  title: Text(
                    u['email'],
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                  subtitle: Text(
                    u['user_type'],
                    style: const TextStyle(fontSize: 12, color: Colors.black54),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      
                      if (u['user_type'] == 'lecturer' )
                        IconButton(
                          icon: const Icon(Icons.assignment),
                          color: Colors.blue,
                          onPressed: () {
                            
                            Navigator.push(
                            context, 
                            MaterialPageRoute(builder: (context) => AssignmentsPage(email: u['email'],)));
                          },
                        ),
                      if (u['user_type'] == 'student')
                        IconButton(
                          icon: const Icon(Icons.subdirectory_arrow_right),
                          color: Colors.black,
                          onPressed: () {
                            
                            Navigator.push(
                            context, 
                            MaterialPageRoute(builder: (context) => StudentViewSubmissionsPage(stuEmail: u['email'],)));
                          },
                        ),
                      // Delete button
                      IconButton(
                        icon: const Icon(Icons.delete),
                        color: Colors.red[300],
                        onPressed: () async {
                          showCupertinoDialog(
                            context: context,
                            builder: (BuildContext context) =>
                                CupertinoAlertDialog(
                              title: const Text('Alert'),
                              content: const Text(
                                  'Are you sure you want to delete this user?'),
                              actions: <CupertinoDialogAction>[
                                CupertinoDialogAction(
                                  isDestructiveAction: false,
                                  onPressed: () {
                                    Navigator.pop(context);
                                  },
                                  child: const Text('No'),
                                ),
                                CupertinoDialogAction(
                                  isDestructiveAction: true,
                                  onPressed: () async {
                                    bool deleteState = await UserService()
                                        .deleteUser(u['email']);
                                    if (deleteState) {
                                      setState(() {
                                        users.removeAt(index);
                                      });
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(const SnackBar(
                                              content:
                                                  Text('User deleted..')));
                                    }
                                    Navigator.pop(context);
                                  },
                                  child: const Text('Yes'),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  void getUsers() async {
    try {
      final fetchUsers = await UserService().fetchUsers();
      setState(() {
        users = fetchUsers;
      });
    } catch (e) {
      throw "$e";
    }
  }
}
