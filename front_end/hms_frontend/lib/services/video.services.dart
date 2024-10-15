import 'dart:io';
import 'package:path/path.dart';
import 'package:hms_frontend/constants.dart';
import 'package:hms_frontend/services/token.services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:video_compress/video_compress.dart';

class VideoServices {
  final Dio _dio = Dio();
  
Future <bool> postVideo(stuEmail, vURI, uDate, assignNumb) async {
    try {
      final uri = Uri.parse("$apiURL/api/assignment");
      String? token = await TokenService().getToken();
      

      final response = await http.post(uri, 
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
          "stu_Email": stuEmail,
          "vid_Link" : vURI,
          "upload_Date" : uDate,
          "assignm_Num" : assignNumb,
        }));

        if (response.statusCode == 200){
          return true;
        }
        else{
          var resBody = jsonDecode(response.body);
          print(resBody['error']);
        }
      return false;
    } catch (e) {
      throw Exception('Error while uploading video');
    }
  }
  
Future<dynamic> uploadVideo(File videoFile, Function(int, int)? onSendProgress) async{
     try {
      final uri = "$apiURL/api/upload";
      String? token = await TokenService().getToken();

      FormData formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(videoFile.path, filename: basename(videoFile.path)),
      });

      Response response = await _dio.post(
        uri,
        data: formData,
        options: Options(
          headers: {
            'Authorization': 'bearer $token',
            'Content-Type': 'multipart/form-data',
          },
        ),
        onSendProgress: onSendProgress, //Send progress back to interface
      );


       if (response.statusCode == 200) {
        var resBody = response.data;
        if (resBody['fileLinks'] != null && resBody['fileLinks'].isNotEmpty) {
          return resBody['fileLinks'][0]; // Return the first link
        }
        return null; // No file links found in the response
      } else {
        throw Exception('Failed to upload video. Status code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error uploading video: $e');
    }
  }


 // Compress Video Function
static Future <File?> compressVideo(File videoFile) async {
    try {
      //compression progress
      VideoCompress.compressProgress$.subscribe((progress) {
        print('Compression Status: $progress%');
      });

      //video compression
      final MediaInfo? compVideo = await VideoCompress.compressVideo(
        videoFile.path,
        quality: VideoQuality.MediumQuality,
        deleteOrigin: false, //To not delete file being compressed
      );

      if (compVideo != null && compVideo.file != null) {
        print('Compression success: ${compVideo.file!.path}');
        return compVideo.file; // Return compressed video file
      } else {
        print('Compression failed.');
        return null;
      }
    } catch (e) {
      print('Error Occurred: $e');
      return null;
    }
  }


//Service to store video record in MongoDB
static Future<dynamic> storeVideoDB(String sEmail, String vURI, DateTime uDate, int assignNum) async{
  try {
    final uri = Uri.parse("$apiURL/api/video");
      String? token = await TokenService().getToken();

      final response = await http.post(uri, 
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
          "stu_Email": sEmail,
          "vid_Link": vURI,
          "upload_Date" : uDate,
          "assignm_Num" : assignNum,
        }));

        if (response.statusCode == 200){
          return true;
        }
        else{
          var resBody = jsonDecode(response.body);
          print(resBody['error']);
        }
  } catch (e) {
    return e.toString();
  }
}

//Service to delete video record in MongoDB
static Future<dynamic> deleteVideoDB(int videoNumb) async {
  try {
      final uri = Uri.parse("$apiURL/api/video");
      String? token = await TokenService().getToken();
      
      final response = await http.delete(uri, 
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
          "vid_Num": videoNumb,
        }));

        if (response.statusCode == 200){
          return true;
        }
        else{
          var resBody = jsonDecode(response.body);
          return resBody['error'];
        }
    } catch (e) {
      throw Exception('Error while uploading video');
    }
  }

//Service to delete a video from aws s3
static Future<dynamic> deleteVideo(String url) async {
  try {
      final uri = Uri.parse("$apiURL/api/delete");
      String? token = await TokenService().getToken();
      

      final response = await http.delete(uri, 
      headers: <String, String>{
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: jsonEncode(<String, dynamic>{
          "fileUrl": url
        }));

        if (response.statusCode == 200){
          return true;
        }
        else{
          var resBody = jsonDecode(response.body);
          return resBody['error'];
        }
    } catch (e) {
      throw Exception('Error while uploading video');
    }
  }
  // Dispose after compression completed
  void disposeCompression() {
    VideoCompress.dispose();
  }

}

