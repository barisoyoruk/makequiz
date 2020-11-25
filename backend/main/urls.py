from django.urls import path, include
from main.views import (
	api_detail_teacher_view, 
	api_detail_student_view, 
	api_detail_section_view,
	api_detail_quiz_view, 
	QuestionViewSet,
	AssignmentViewSet,
	SubmissionViewSet,
	AnswerViewSet,
	ResultViewSet,
	api_teacher_registration_view,
	api_student_registration_view,
	api_section_create_view,
	api_quiz_create_view,
	QuestionCreateViewSet,
	AssignmentCreateViewSet,
	AnswerCreateViewSet,
	SubmissionCreateViewSet,
	ResultCreateViewSet,
	CustomAuthToken,
	api_section_assignment_view
)
from rest_framework.authtoken.views import obtain_auth_token

app_name = 'main'

urlpatterns = [
	path('teacher/<pk>', api_detail_teacher_view),
	path('student/<pk>', api_detail_student_view),
	path('section/<pk>', api_detail_section_view),
	path('quiz/<pk>', api_detail_quiz_view),
	path('question/<pk>', QuestionViewSet.as_view()),
	path('assignment/<pk>', AssignmentViewSet.as_view()),
	path('submission/<pk>', SubmissionViewSet.as_view()),
	path('answer/<pk>', AnswerViewSet.as_view()),
	path('result/<pk>', ResultViewSet.as_view() ),
	path('teacher/register/', api_teacher_registration_view),
	path('student/register/', api_student_registration_view),
	path('teacher/login/', CustomAuthToken.as_view()),
	path('student/login/', CustomAuthToken.as_view()),
	path('section/create/', api_section_create_view),
	path('quiz/create/', api_quiz_create_view),
	path('question/create/', QuestionCreateViewSet.as_view()),
	path('assignment/create/', AssignmentCreateViewSet.as_view()),
	path('answer/create/', AnswerCreateViewSet.as_view()),
	path('submission/create/', SubmissionCreateViewSet.as_view()),
	path('result/create/', ResultCreateViewSet.as_view()),
	path('assignment/createWithSection/', api_section_assignment_view),
]

urlpatterns += [
	path('api-auth/', include('rest_framework.urls')),
	path(r'api-token-auth/', include('rest_framework.urls')),
]