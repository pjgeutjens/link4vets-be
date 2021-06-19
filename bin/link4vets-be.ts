#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Link4VetsBeStack } from '../lib/link4vets-be-stack';
import { Tags } from '@aws-cdk/core';

const app = new cdk.App();
const stack = new Link4VetsBeStack(app, 'Link4VetsBeStack');
Tags.of(stack).add('App', 'Link4VetsPlatform');
Tags.of(stack).add('Environment', 'Development');
