# AWS-CDK-SAMPLE
## cdk-setup
```
cdk init app --language typescript
```

## ディレク構成
bin: エントリーポイント  
lib: インフラのコアコード  

## tsからjsにビルド(実行する必要なし。cdk deployの時にts-nodeで直接実行されるので)
```
npm run build
```

## AWSリソースの集合を表示する
```
cdk ls
```

## CloudFormationテンプレートを生成する
```
cdk synth
```

## CDKのデプロイに使うストレージを作成する
```
cdk bootstrap
```

## すべてのcdkをデプロイ
```
cdk deploy --all
cdk deploy STACK_NAME
```

## cdkに紐づくすべてのリソースを削除
```
cdk destroy --all
cdk destroy STACK_NAME
```