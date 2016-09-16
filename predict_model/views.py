from django.shortcuts import render
from predict_model import models as predict_model
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random
import prediction_helper as p

# import prediction_helper as p
# print p



@csrf_exempt
def make_predictions_api(request):
    try: 
        response=[]
        tweets=[]
        data=json.loads(request.body)
     
        for x in data:
            sentiment=p.sentiment(x['tweet-text'])
            tweets.append(predict_model.tweets(data_tweet_id=x['data-tweet-id'],data_user_id=x['data-user-id'],data_permalink_path=x['data-permalink-path'],data_screen_name=x['data-screen-name'],data_you_follow=x['data-you-follow'],data_follow_you=x['data-follow-you'],tweet_text=x['tweet-text'],machine_label=sentiment[0],confidence=sentiment[1],profile_pic=x['profile-pic']))      
            response.append({"label":sentiment[0],"confidence":sentiment[1],"data-tweet-id":x['data-tweet-id'],"tweet-text":x['tweet-text']})
        predict_model.tweets.objects.bulk_create(tweets,batch_size=100)           
        return HttpResponse(json.dumps(response),status=200,content_type='application/json')  

   
    except Exception as e:   
        return HttpResponse(e,status=400,content_type='application/json')  



def all_tweets(request):
    try:
        limit=request.GET['num']
        offset=request.GET['offset']
        # print offset
        tweet=predict_model.tweets.objects.raw("select * from tweets where human_label='' group by (data_tweet_id) limit "+limit+" OFFSET "+offset+"")    
        return render(request, 'tweets.html', {"data":tweet})        
    except Exception, e:
        return HttpResponse(str(e),status=400,content_type='application/json')
    
    


@csrf_exempt    
def change_status(request):
    try:  
        for data in json.loads(request.body):       
            predict_model.tweets.objects.filter(data_tweet_id=data['data_tweet_id']).update(human_label=data['human_label'])   

        return HttpResponse(json.dumps({"data":"done"}),status=200,content_type='application/json') 
    except Exception as e:
        return HttpResponse(str(e),status=400,content_type='application/json')  

def landing(request):
  return HttpResponse(json.dumps({"data":"Hack hack hack"}),status=200,content_type='application/json')  


@csrf_exempt
def test_api(request):  
  x=json.loads(request.body)  
  sentiments=p.sentiment(x['tweet-text'])
  final_data={"confidence":sentiments[1],"label":sentiments[0]}
  return HttpResponse(json.dumps(final_data),status=200,content_type='application/json')  



def change_tweet_status(request):
    try:        
        tweet=predict_model.tweets.objects.all().order_by('-id').values()[:10]
        return render(request, 'tweets_data.html', {"data":tweet})        
    except Exception, e:
        return HttpResponse(str(e),status=400,content_type='application/json')
@csrf_exempt
def alter_training_status(request):
    
    try:
        for data in json.loads(request.body): 

            predict_model.tweets.objects.filter(id=data['id']).update(is_trainable=data['is_training'])  
       
        return HttpResponse(json.dumps({"data":"done"}),status=200,content_type='application/json') 
    except Exception as e:

        return HttpResponse(str(e),status=400,content_type='application/json')  
