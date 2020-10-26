from django.shortcuts import render
from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view

from main.models import Teacher, Student, Section, Quiz, Question, Assignment, Answer, Submission, Result
from main.serializers import (
	TeacherSerializer,
	StudentSerializer,
	SectionSerializer,
	QuizSerializer,
	QuestionSerializer,
	AssignmentSerializer,
	AnswerSerializer,
	SubmissionSerializer,
	ResultSerializer,
	TeacherRegistrationSerializer,
	StudentRegistrationSerializer,
	SectionCreateSerializer,
	SectionStudentAdditionSerializer,
	QuizCreateSerializer,
	QuestionCreateSerializer
	)

@api_view(['GET', 'DELETE'])
def api_detail_teacher_view(request, pk):

	try:
		teacher = Teacher.objects.get(pk = pk)
	except teacher.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = TeacherSerializer(teacher)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = teacher.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data=data)

@api_view(['GET', 'DELETE'])
def api_detail_student_view(request, pk):
# Create your views here.
	try:
		student = Student.objects.get(pk=pk)
	except student.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = StudentSerializer(student)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = student.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data=data)

@api_view(['GET', 'DELETE', 'PUT'])
def api_detail_section_view(request, pk):
# Create your views here.
	try:
		section = Section.objects.get(pk = pk)
	except Section.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = SectionSerializer(section)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = section.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data = data)
	elif request.method == 'PUT':
		serializer = SectionStudentAdditionSerializer(section, data = request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def api_detail_quiz_view(request, pk):
# Create your views here.
	try:
		quiz = Quiz.objects.get(pk = pk)
	except quiz.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = QuizSerializer(quiz)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = quiz.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data = data)

class QuestionViewSet(generics.RetrieveDestroyAPIView):
	queryset = Question.objects.get_queryset()
	serializer_class = QuestionSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
	serializer_class = AssignmentSerializer

@api_view(['GET', 'DELETE'])
def api_detail_assignment_view(request, pk):
# Create your views here.
	try:
		assignment = Assignment.objects.get(pk = pk)
	except assignment.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = AssignmentSerializer(assignment)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = assignment.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data = data)

@api_view(['GET', 'DELETE'])
def api_detail_answer_view(request, pk):
# Create your views here.
	try:
		answer = Answer.objects.get(pk = pk)
	except answer.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = AnswerSerializer(answer)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = answer.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data = data)

@api_view(['GET', 'DELETE'])
def api_detail_submission_view(request, pk):
# Create your views here.
	try:
		submission = Submission.objects.get(pk = pk)
	except submission.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = SubmissionSerializer(submission)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = submission.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data = data)

@api_view(['GET', 'DELETE'])
def api_detail_result_view(request, pk):
# Create your views here.
	try:
		result = Result.objects.get(pk = pk)
	except result.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = ResultSerializer(result)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		operation = result.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data = data)

@api_view(['POST'])
def api_teacher_registration_view(request):
	if request.method == 'POST':
		serializer = TeacherRegistrationSerializer(data = request.data)
		data = {}
		if serializer.is_valid():
			teacher = serializer.save()
			data['response'] = "Successfully registered a new teacher."
			data['email'] = teacher.user.email
		else:
			data = serializer.errors
		return Response(data)

@api_view(['POST'])
def api_student_registration_view(request):
	if request.method == 'POST':
		serializer = StudentRegistrationSerializer(data = request.data)
		data = {}
		if serializer.is_valid():
			student = serializer.save()
			data['response'] = "Successfully registered a new student."
			data['email'] = student.user.email
		else:
			data = serializer.errors
		return Response(data)

@api_view(['POST'])
def api_section_create_view(request):
	if request.method == 'POST':
		serializer = SectionCreateSerializer(data = request.data)
		data = {}
		if serializer.is_valid():
			section = serializer.create(request.data)
			data['response'] = "Successfully created a new section."
			data['section_code'] = section.section_code
		else:
			data = serializer.errors
		return Response(data)

@api_view(['POST'])
def api_quiz_create_view(request):
	if request.method == 'POST':
		serializer = QuizCreateSerializer(data = request.data)
		data = {}
		if ( serializer.is_valid() ):
			section = serializer.save()
			data['response'] = "Successfully created a new quiz."
		else:
			data = serializer.errors
		return Response(data)

class QuestionCreateViewSet(generics.CreateAPIView):
	serializer_class = QuestionCreateSerializer