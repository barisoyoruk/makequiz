# Generated by Django 3.1.2 on 2020-11-25 14:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_question_question_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='main.question'),
        ),
        migrations.AlterField(
            model_name='answer',
            name='submission',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='main.submission'),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='main.quiz'),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='main.student'),
        ),
        migrations.AlterField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='main.quiz'),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='quiz_no',
            field=models.CharField(max_length=3),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quizzes', to='main.teacher'),
        ),
        migrations.AlterField(
            model_name='section',
            name='students',
            field=models.ManyToManyField(related_name='sections', to='main.Student'),
        ),
        migrations.AlterField(
            model_name='section',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='main.teacher'),
        ),
        migrations.AlterField(
            model_name='student',
            name='student_class',
            field=models.CharField(choices=[('Freshman', 'Freshman'), ('Sophomore', 'Sophomore'), ('Junior', 'Junior'), ('Senior', 'Senior')], max_length=9),
        ),
        migrations.AlterField(
            model_name='submission',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='main.quiz'),
        ),
        migrations.AlterField(
            model_name='submission',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='main.student'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('ST', 'Student'), ('TE', 'Teacher'), ('NO', 'None')], default='NO', max_length=7),
        ),
    ]