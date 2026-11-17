import test from 'node:test';
import assert from 'node:assert/strict';
import {hasAcceptedNotice} from '../src/site-notice.js';
test('only explicit exact preference cookie hides the notice',()=>{assert.equal(hasAcceptedNotice(''),false);assert.equal(hasAcceptedNotice('vk_site_notice_v1=rejected'),false);assert.equal(hasAcceptedNotice('xvk_site_notice_v1=accepted'),false);assert.equal(hasAcceptedNotice('other=1; vk_site_notice_v1=accepted'),true);});
