import 'dart:io';
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
  double _uploadProgress = 0.0;
  bool _isUploading = false;

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

  Future<void> uploadSelectedVideo() async {
    if (_videoFile != null) {
      try {
        setState(() {
          _isUploading = true;
          _uploadProgress = 0.0;
        });

        String? videoLink = await VideoServices().uploadVideo(
          _videoFile!,
          (int sentBytes, int totalBytes) {
            setState(() {
              _uploadProgress = sentBytes / totalBytes;
            });
          },
        );

        setState(() {
          _isUploading = false;
        });

        if (videoLink != null) {
          print('Video uploaded successfully: $videoLink');
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

  void removeAttachedFile() {
    setState(() {
      _videoFile = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Media Upload',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.deepPurple,
        elevation: 4.0,
      ),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                // Show selected video file or 'No file attached'
                _videoFile != null
                    ? Column(
                        children: [
                          Text(
                            basename(_videoFile!.path),
                            style: const TextStyle(
                                fontSize: 16, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 10),
                          ElevatedButton.icon(
                            onPressed: removeAttachedFile,
                            icon: const Icon(Icons.delete, color: Colors.white),
                            label: const Text(
                              'Remove File',
                              style: TextStyle(color: Colors.white),
                            ),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 20, vertical: 15),
                              backgroundColor: Colors.redAccent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30.0),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],
                      )
                    : const Text(
                        'No file attached',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                const SizedBox(height: 20),
                // Attach file button, disabled if file is attached
                ElevatedButton.icon(
                  onPressed: _videoFile != null ? null : pickVideo,
                  icon: const Icon(Icons.file_open_rounded, color: Colors.white),
                  label: const Text(
                    'Attach File',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                    backgroundColor:
                        _videoFile != null ? Colors.grey : Colors.lightBlue,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    ),
                  ),
                ),
                const SizedBox(height: 30),
                if (_isUploading) ...[
                  const Text('Uploading...'),
                  const SizedBox(height: 10),
                  LinearProgressIndicator(
                    value: _uploadProgress,
                    backgroundColor: Colors.grey[300],
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.deepPurpleAccent),
                    minHeight: 8,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    '${(_uploadProgress * 100).toStringAsFixed(1)}%',
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
                const SizedBox(height: 40),
                // Upload button, disabled if file is uploading or no file is attached
                ElevatedButton.icon(
                  onPressed: _isUploading || _videoFile == null ? null : uploadSelectedVideo,
                  icon: const Icon(Icons.cloud_upload, color: Colors.white),
                  label: const Text(
                    'Upload Video',
                    style: TextStyle(color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                    backgroundColor: _isUploading || _videoFile == null
                        ? Colors.grey
                        : Colors.deepPurpleAccent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    ),
                    elevation: _isUploading ? 0 : 5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
