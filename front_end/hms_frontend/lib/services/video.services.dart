import 'dart:io';
import 'package:path/path.dart';
import 'package:hms_frontend/constants.dart';
import 'package:hms_frontend/services/token.services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


class VideoServices {
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
  
  Future <dynamic> uploadVideo(File videoFile) async {
     try {
      final uri = Uri.parse("$apiURL/api/upload");
      String? token = await TokenService().getToken();

      var request = http.MultipartRequest('POST', uri);

      request.headers.addAll({
        'Authorization': 'bearer $token',
        'Content-Type': 'application/json; charset=UTF-8'
      });
      request.files.add(
        await http.MultipartFile.fromPath('file',
        videoFile.path,
        filename: basename(videoFile.path),)
      );

      var sResponse = await request.send();

      var response = await http.Response.fromStream(sResponse);

      if (response.statusCode ==200){
        var resBody = jsonDecode(response.body);

        if (resBody['fileLinks'] != null && resBody['fileLinks'].isNotEmpty) {
          return resBody['fileLinks'][0]; // Return the first link
        }
      return null; // No file links found in the response
      }
      else{
        throw Exception('Failed to upload video. Status code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('VUE: $e');
    }
  }
}
