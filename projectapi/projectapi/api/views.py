import pyodbc
from django.shortcuts import render
import json
import requests

# Create your views here.

from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
import pyodbc

#from api.models import Campaign, NoCoronaCampaign
#from api.serializers import CampaignSerializer, NoCoronaCampaignSerializer


###############################################################
######################## OLD AZURE VIEWS ######################
###############################################################

########################## AZURE VIEWS ########################
@csrf_exempt
def runModel(scoring_uri, key, input):
    # Two sets of data to score, so we get two results back
    data = {
        "Inputs": {
            "input1": input
        },
    }
    # Convert to JSON string
    input_data = json.dumps(data)

    # Set the content type
    headers = {'Content-Type': 'application/json'}
    # If authentication is enabled, set the authorization header
    headers['Authorization'] = f'Bearer {key}'

    # Make the request and display the response
    resp = requests.post(scoring_uri, input_data, headers=headers)
    resp = json.loads(resp.text)

    # print('HEY: ', resp)
    return float(resp['Results']['output1']['value']['Values'][0][13])

@csrf_exempt
@api_view(['GET', 'POST', ])
def getPassing(request):

    shotURL = 'https://ussouthcentral.services.azureml.net/workspaces/e7626090de274eec971d136acbc67e67/services/35181a0c42af417587afa2831a117f92/execute?api-version=2.0&details=true'
    shotKey = 'VAy8hjJzCxh38qhiN7gHa9J13rbb457anbGAWo43SxXCnTFFWXUn5/ASGVRoRIzYXksVRQgrn+lVv5L8+HFUrw=='

    stuff = json.loads(request.body)

    def_rank = stuff['def_rank']
    drive_pass_count = stuff['drive_pass_count']
    Under_two = stuff['Under_two']
    down = stuff['down']
    distance = stuff['distance']
    zone = stuff['zone']
    success_rate = stuff['success_rate']
    month = stuff['month']
    running_avg_drive_passing_yards = stuff['running_avg_drive_passing_yards']
    score_diff = stuff['score_diff']
    previous_yards_gained = stuff['previous_yards_gained']
    yards_to_goal = stuff['yards_to_goal']
    previous_zone = 'green'
    yards_gained = 0

    shotInputs = {
        "ColumnNames": ["def_rank", "drive_pass_count", "Under_two", "down", "distance", "zone", "success_rate", "month", "running_avg_drive_passing_yards", "score_diff", "previous_yards_gained", "yards_to_goal", "yards_gained"],
        "Values": [[def_rank, drive_pass_count, Under_two, down, distance, zone, success_rate, month, running_avg_drive_passing_yards, score_diff, previous_yards_gained, yards_to_goal, yards_gained], ]
    }

    passing_prediction = runModel(shotURL, shotKey, shotInputs)

    passing_prediction2 = round(passing_prediction)

    # SAVE RESULTS TO DB
    server = 'sagroup1.database.windows.net'
    database = 'BYU_Football'
    username = 'saadmin'
    password = 'CrispyChris<3'
    driver = 'ODBC Driver 17 for SQL Server'
    cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server +
                          ';PORT=1433;DATABASE='+database+';UID='+username+';PWD=' + password)
    cursor = cnxn.cursor()

    cursor.execute(
        "INSERT INTO passing(def_rank, drive_pass_count, Under_two, down, distance, zone, success_rate, month, running_avg_drive_passing_yards, score_diff, previous_yards_gained, yards_to_goal, yards_gained, previous_zone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", def_rank, drive_pass_count, Under_two, down, distance, zone, success_rate, month, running_avg_drive_passing_yards, score_diff, previous_yards_gained, yards_to_goal, passing_prediction2, previous_zone)

    cnxn.commit()
    cursor.close()
    cnxn.close()

    return Response({"result": passing_prediction2})

@csrf_exempt
def runModel2(scoring_uri, key, input):
    # Two sets of data to score, so we get two results back
    data = {
        "Inputs": {
            "input1": input
        },
    }
    # Convert to JSON string
    input_data = json.dumps(data)

    # Set the content type
    headers = {'Content-Type': 'application/json'}
    # If authentication is enabled, set the authorization header
    headers['Authorization'] = f'Bearer {key}'

    # Make the request and display the response
    resp = requests.post(scoring_uri, input_data, headers=headers)
    resp = json.loads(resp.text)

    # print('HEY: ', resp)

    return float(resp['Results']['output1']['value']['Values'][0][12])



@csrf_exempt
@api_view(['GET', 'POST', ])
def getRushing(request):
    rushingURL = 'https://ussouthcentral.services.azureml.net/workspaces/e7626090de274eec971d136acbc67e67/services/0535e65421354d6383114bea264a2d63/execute?api-version=2.0&details=true'
    rushingKey = 'eIsUWsnwqxl0TbHv19nHnt4OT4qIRQnRdXUoDo2L5gqpJ6fk/xMRN2od1zrl3esK7xpza7/eT7taOJj505aICA=='

    stuff = json.loads(request.body)

    def_rank = stuff['def_rank']
    drive_rush_count = stuff['drive_rush_count']
    Under_two = stuff['Under_two']
    down = stuff['down']
    distance = stuff['distance']
    zone = stuff['zone']
    month = stuff['month']
    running_avg_drive_rushing_yards = stuff['running_avg_drive_rushing_yards']
    score_diff = stuff['score_diff']
    previous_yards_gained = stuff['previous_yards_gained']
    yards_to_goal = stuff['yards_to_goal']
    previous_zone = 'green'
    yards_gained = 0

    rushingInputs = {
        "ColumnNames": ["def_rank", "drive_rush_count", "Under_two", "down", "distance", "zone", "month", "running_avg_drive_rushing_yards", "score_diff", "previous_yards_gained", "yards_to_goal", "yards_gained"],
        "Values": [[def_rank, drive_rush_count, Under_two, down, distance, zone, month, running_avg_drive_rushing_yards, score_diff, previous_yards_gained, yards_to_goal, yards_gained], ]
    }

    rushing_prediction = runModel2(rushingURL, rushingKey, rushingInputs)

    rushing_prediction2 = round(rushing_prediction)

    # SAVE RESULTS TO DB
    server = 'sagroup1.database.windows.net'
    database = 'BYU_Football'
    username = 'saadmin'
    password = 'CrispyChris<3'
    driver = 'ODBC Driver 17 for SQL Server'
    cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server +
                          ';PORT=1433;DATABASE='+database+';UID='+username+';PWD=' + password)
    cursor = cnxn.cursor()

    cursor.execute(
        "INSERT INTO rushing(def_rank, drive_rush_count, Under_two, down, distance, zone, month, running_avg_drive_rushing_yards, score_diff, previous_yards_gained, yards_to_goal, yards_gained, previous_zone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", def_rank, drive_rush_count, Under_two, down, distance, zone, month, running_avg_drive_rushing_yards, score_diff, previous_yards_gained, yards_to_goal, rushing_prediction2, previous_zone)

    cnxn.commit()
    cursor.close()
    cnxn.close()

    return Response({"result": rushing_prediction2})
