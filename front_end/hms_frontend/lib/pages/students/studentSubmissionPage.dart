import 'package:flutter/material.dart';
import 'package:hms_frontend/components/videoPlayer.dart';
import 'package:video_player/video_player.dart';

class StudentSubmissionsPage extends StatefulWidget {
  const StudentSubmissionsPage({super.key});

  @override
  State<StudentSubmissionsPage> createState() => _SubmissionsPageState();
}

class _SubmissionsPageState extends State<StudentSubmissionsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar( title: const Text('Video Players'),
      
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          VideoPlayerWidget(
          url: 'https://humanmovement-bucket.s3.eu-north-1.amazonaws.com/Uploads%2F479a9175-8dbf-4119-81fd-ec79b420fad3-VID-20230903-WA0051.mp4', 
          dataSourceType: DataSourceType.network
          ),
          SizedBox(height: 24,
          ),
        ],
      ),
    );
  }
}