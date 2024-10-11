import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:hms_frontend/services/video.services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart'; // For file basename

class MediaPage extends StatefulWidget {
  const MediaPage({super.key});

  @override
  State<MediaPage> createState() => _MediaPageState();
}

class _MediaPageState extends State<MediaPage> {

  File? _videoFile;
  final ImagePicker _picker = ImagePicker();

  Future<void> pickVideo() async {
    final inputFile = await _picker.pickVideo(source: ImageSource.gallery);

    if (inputFile != null) {
      setState(() {
        _videoFile = File(inputFile.path);
      });
    } else {
      print('No video selected.');
    }
  }

    // Call the uploadVideo function
  Future<void> uploadSelectedVideo() async {
    if (_videoFile != null) {
      try {
        String? videoLink = await VideoServices().uploadVideo(_videoFile!);
        if (videoLink != null) {
          print('Video uploaded successfully: $videoLink');
          // Display success message or use the video link as needed
        } else {
          print('Failed to upload video.');
        }
      } catch (e) {
        print('Error while uploading video: $e');
      }
    } else {
      print('No video file to upload.');
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Title(
          color: Colors.blue,
          child: const Text(
            'Media',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        backgroundColor: Colors.deepPurple,
      ),
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              ElevatedButton(
                onPressed: pickVideo ,
                style:
                    ElevatedButton.styleFrom(backgroundColor: Colors.lightBlue),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Text(
                      'Open Media',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Icon(Icons.file_open_rounded),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: ElevatedButton(
        onPressed: uploadSelectedVideo,
        child: Row(
          children: [
            Text('Upload video'),
            const Icon(
              Icons.add,
              color: Colors.blue,
            ),
          ],
        ),
      ),
    );
  }
}
