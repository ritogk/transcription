#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { TranscriptionMainStack } from "../lib/transcription-main-stack"
import { TranscriptionAcmStack } from "../lib/transcription-acm-stack"
import * as dotenv from "dotenv"
dotenv.config()

// 環境変数へのアクセス
const hostedZoneId = process.env.HOST_ZONE_ID ?? ""
const subDomain = process.env.SUB_DOMAIN ?? ""
const domain = process.env.DOMAIN ?? ""

const app = new cdk.App()

const acmCdk = new TranscriptionAcmStack(
  app,
  "TranscriptionAcmStack",
  domain,
  subDomain,
  hostedZoneId,
  {
    env: { region: "us-east-1" },
    crossRegionReferences: true,
  }
)

new TranscriptionMainStack(
  app,
  "TranscriptionMainStack",
  domain,
  subDomain,
  hostedZoneId,
  acmCdk.certificate,
  {
    env: {
      region: "ap-northeast-1",
    },
    crossRegionReferences: true,
  }
)
